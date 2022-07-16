/**
 * This file is needed due to the way keg-core resolve taps
 * It expects an index file in the root directly that exports { App }
 * Because the tap is in a sub repo, we need to re-export it from here
 */
export * from './repos/tap'
