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
      expect(memoryCache.descriptiveName.indexOf('Unspecified')).greaterThanOrEqual(0)

      const memoryCache2 = CacheManagerFactory.createTtlMemoryCache({ ttl: 1000, descriptiveName: 'TtlMemoryCache' })
      expect(memoryCache2.descriptiveName.indexOf('TtlMemoryCache')).greaterThanOrEqual(0)
    })

    it('2 tiers, entry should go to both', async () => {
      const inMemoryStore1 = createKeyvSimpleMemoryStore({ ttl: 5000 })
      const inMemoryStore2 = createKeyvSimpleMemoryStore({ ttl: 5000 })

      const twoTiersMemoryCache = CacheManagerFactory.createCache([inMemoryStore1, inMemoryStore2], '2TiersCache')
      expect(twoTiersMemoryCache.stores.length).toBe(2)

      twoTiersMemoryCache.set('key', obj)
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

    it('wrap', async () => {
      const cacheManager = CacheManagerFactory.createLruMemoryCache({ maxItemsCount: 3 })

      expect(await cacheManager.wrap('key', () => 'value', 30000)).toBe('value')
      expect(await cacheManager.get('key')).toBe('value')
    })

    it('get set wrap', async () => {
      const cacheManager = CacheManagerFactory.createLruMemoryCache({ maxItemsCount: 3 })

      await cacheManager.set('foo', 'bar')
      expect(await cacheManager.get('foo')).toBe('bar')

      await cacheManager.del('foo')
      await cacheManager.get('foo')
      expect(await cacheManager.get('foo')).toBeUndefined()

      await cacheManager.set('obj', { a: 1, b: '2' })
      expect(await cacheManager.get('obj')).toMatchObject({ a: 1, b: '2' })
    })
  })
})
