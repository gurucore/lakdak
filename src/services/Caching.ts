import { createCache, Cache as CacheManagerBase, Events } from 'cache-manager'
import { createKeyv as createKeyvSimpleMemoryStore, WrapOptions } from 'cacheable'
import EventEmitter from 'events'
import { Keyv, StoredDataRaw } from 'keyv'

import { LRUCache } from 'lru-cache'

export namespace Caching {
  export interface CacheManager {
    descriptiveName: string

    // copy type Cache as CacheManagerBase from cache-manager
    get: <T>(key: string) => Promise<T | undefined>
    mget: <T>(keys: string[]) => Promise<Array<T | undefined>>
    ttl: (key: string) => Promise<number | undefined>
    set: <T>(key: string, value: T, ttl?: number) => Promise<T>
    mset: <T>(
      list: Array<{
        key: string
        value: T
        ttl?: number
      }>
    ) => Promise<
      Array<{
        key: string
        value: T
        ttl?: number
      }>
    >
    del: (key: string) => Promise<boolean>
    mdel: (keys: string[]) => Promise<boolean>
    clear: () => Promise<boolean>
    on: <E extends keyof Events>(event: E, listener: Events[E]) => EventEmitter
    off: <E extends keyof Events>(event: E, listener: Events[E]) => EventEmitter
    disconnect: () => Promise<undefined>
    cacheId: () => string
    stores: Keyv[]

    /**
     * Fetch value with function, cache it.
     *
     * @description Calling multiple wrap() with the same key at the same time will only call the function once.
     * If a cache item has a TTL of 10 seconds and the refreshThreshold is set to 3 seconds, the library will trigger a background refresh when the item's TTL is 3 seconds or less.
     * The library will return the existing value until the new value is available from the background process.
     * In essence, the refreshThreshold allows you to optimize for both responsiveness (by serving the existing cached value) and freshness (by updating the cache in the background).
     *
     * @description When we have multiple tiers (stores), the store that will be checked for refresh is the one where the key will be found first (highest priority).
     * If the threshold is low and the worker function is slow, the key may expire and you may encounter a racing condition with updating values.
     * @param key
     * @param fnc function to fetch fresh value
     * @param ttl in miliseconds, time to live
     * @param refreshThreshold in miliseconds, If refreshThreshold is set and the remaining TTL is less than refreshThreshold, the system will update the value asynchronously. In the meantime, the system will return the old value until expiration. If no ttl is set for the key, the refresh mechanism will not be triggered.
     */
    wrap<T>(key: string, fnc: () => T | Promise<T>, ttl?: number | ((value: T) => number), refreshThreshold?: number | ((value: T) => number)): Promise<T>
    wrap<T>(key: string, fnc: () => T | Promise<T>, options: WrapOptions): Promise<T>
    wrap<T>(key: string, fnc: () => T | Promise<T>, options: WrapOptions): Promise<StoredDataRaw<T>>
  }

  /**
   * Factory to create CacheManager, see features and examples howto use CacheManager in https://github.com/jaredwray/cacheable/blob/main/packages/cache-manager/README.md
   */
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
      }) as unknown as CacheManager
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
