import { createCache, Cache as CacheManagerBase } from 'cache-manager'
import { createKeyv as createKeyvSimpleMemoryStore } from 'cacheable'
import { Keyv } from 'keyv'

import { LRUCache } from 'lru-cache'

export namespace Caching {
  export type CacheManager = {
    descriptiveName: string
  } & CacheManagerBase

  // NOTE: TECH: if we manually create Keyv, default serialize and deserialize will be JSONB.stringify and JSONB.parse
  // const s = new Keyv({ store: new CacheableMemory() })
  // console.log('s', s.serialize)

  export class CacheManagerFactory {
    /**
     * return a Keyv store, without serialize and deserialize, optimized for InMemory
     * @param ttl
     * @returns
     */
    protected static _createInMemoryTtlStore(ttl: number = 60000) {
      // there will be no serialize and deserialize, and we don't need this for InMemory
      const inMemoryStore = createKeyvSimpleMemoryStore({ ttl })
      inMemoryStore.store.descriptiveName = 'MemoryTtlStore'
      return inMemoryStore
    }

    /**
     * return a Keyv store, without serialize and deserialize, optimized for InMemory
     * @param maxItemsCount The maximum number of items to store in the cache before evicting old entries
     */
    protected static _createInMemoryLruStore(maxItemsCount: number = 5000) {
      const lruCacheStore = new LRUCache({
        max: maxItemsCount
      })
      ;(lruCacheStore as any).descriptiveName = 'MemoryLruStore'

      return new Keyv({
        store: lruCacheStore,
        // there will be no serialize and deserialize, optimized for InMemory
        serialize: undefined,
        deserialize: undefined
      })
    }

    /**
     * helper func to produce/create cache for this Factory
     * @param stores
     * @param descriptiveName auto generated if not provided
     */
    static createCache(stores: Keyv[], descriptiveName: string) {
      const storeName = stores.map((s) => s.store.descriptiveName).join('&')
      const cache = createCache({
        stores
      }) as CacheManager
      cache.descriptiveName = descriptiveName || `Unspecified-${storeName}-Cache init-at-${new Date().toISOString()}`
      console.log(cache.descriptiveName)
      return cache
    }

    /**
     * helper func to produce/create cache for this Factory
     *
     * @description Using CacheableMemory from Cacheable which is a High performance in-memory cache that supports TTL expiration. This also removes the serialize/deserialize methods from the Keyv instance for optimization (http://cacheable.org/docs/cacheable/#cacheablememory---in-memory-cache)
     */
    static createTtlMemoryCache({ ttl = 60000, descriptiveName }: { ttl: number; descriptiveName?: string }) {
      const inMemoryStore = this._createInMemoryTtlStore(ttl)

      return this.createCache([inMemoryStore], descriptiveName)
    }

    /**
     * helper func to produce/create cache for this Factory
     *
     * @description this lru-cache is much more downloaded than cacheable
     * @param maxItemsCount The maximum number of items to store in the cache before evicting old entries. CRITICAL MANDATORY TO SET this option, pre allocated, and faster   */
    static createLruMemoryCache({
      maxItemsCount = 5000,
      descriptiveName
    }: {
      //
      maxItemsCount: number
      descriptiveName?: string
    }) {
      const inMemoryLruTtlStore = this._createInMemoryLruStore(maxItemsCount)

      return this.createCache([inMemoryLruTtlStore], descriptiveName)
    }
  }
}
