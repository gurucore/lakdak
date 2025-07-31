import { vi, it, expect, describe, beforeEach, afterAll, beforeAll } from 'vitest'
import { Caching } from './Caching'
const { CacheManagerFactory } = Caching

import { createKeyv as createKeyvSimpleMemoryStore } from 'cacheable'

describe('CacheManagerFactory', () => {
  const REDIS_URI = 'redis://localhost:6379'

  const obj = { a: 1, b: 'bee', nested: { c: 3.3 } }

  describe('create', async () => {
    it('naming of descriptiveName', async () => {
      const memoryCache = CacheManagerFactory.createTtlMemoryCache({ ttl: 1000 })
      expect(memoryCache.descriptiveName.indexOf('Unnamed')).greaterThanOrEqual(0)

      const memoryCache2 = CacheManagerFactory.createTtlMemoryCache({ ttl: 1000, descriptiveName: 'TtlMemoryCache' })
      expect(memoryCache2.descriptiveName.indexOf('TtlMemoryCache')).greaterThanOrEqual(0)
    })

    it('2 tiers, entry should go to both', async () => {
      const inMemoryStore1 = createKeyvSimpleMemoryStore({ ttl: 5000 })
      const inMemoryStore2 = createKeyvSimpleMemoryStore({ ttl: 5000 })

      const twoTiersMemoryCache = CacheManagerFactory.createCache([inMemoryStore1, inMemoryStore2], '2TiersCache')
      expect(twoTiersMemoryCache.stores.length).toBe(2)

      expect(await twoTiersMemoryCache.set('key', obj)).toMatchObject(obj)

      expect(await twoTiersMemoryCache.get('key')).toMatchObject(obj)
      expect(await inMemoryStore1.get('key')).toMatchObject(inMemoryStore2.get('key'))
    })

    it('memory only', async () => {
      const memoryCache = CacheManagerFactory.createTtlMemoryCache({ ttl: 1000 })
      await memoryCache.set('key', obj)
      expect(await memoryCache.get('key')).toMatchObject(obj)
    })

    it('memory LRU only', async () => {
      const memoryCache = CacheManagerFactory.createLruMemoryCache({ maxItemsCount: 1 })
      await memoryCache.set('key', obj)
      expect(await memoryCache.get('key')).toMatchObject(obj)

      await memoryCache.set('key2', 2)

      // LRU evict key and key2
      await memoryCache.set('key3', 3)
      expect(await memoryCache.get('key')).toBeUndefined()
      expect(await memoryCache.get('key2')).toBeUndefined()
      expect(await memoryCache.get('key3')).toBe(3)
    })
  })

  describe('wrap', async () => {
    it('wrap', async () => {
      const cacheManager = CacheManagerFactory.createLruMemoryCache({ maxItemsCount: 3 })

      expect(await cacheManager.wrap('key', () => 'value', 30000)).toBe('value')
      expect(await cacheManager.get('key')).toBe('value')
    })
  })

  describe('get set number string object', async () => {
    it('number', async () => {
      const cacheManager = CacheManagerFactory.createTtlMemoryCache({ ttl: 10000 })

      expect(await cacheManager.set('foo', 111, 10000)).toStrictEqual(111)
      expect(await cacheManager.get('foo')).toStrictEqual(111)

      await cacheManager.del('foo')
      await cacheManager.get('foo')
      expect(await cacheManager.get('foo')).toBeUndefined()
    })

    it('string', async () => {
      const cacheManager = CacheManagerFactory.createTtlMemoryCache({ ttl: 10000 })

      expect(await cacheManager.set('obj', "obj")).toStrictEqual("obj")
      expect(await cacheManager.get('obj')).toStrictEqual("obj")
    })

    it('object', async () => {
      const cacheManager = CacheManagerFactory.createTtlMemoryCache({ ttl: 10000 })

      expect(await cacheManager.set('obj', obj)).toStrictEqual(obj)
      expect(await cacheManager.get('obj')).toStrictEqual(obj)
    })
  })
})
