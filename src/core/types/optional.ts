/**
 * Make some property optional on type
 *
 * @example
 * ```typescript
 * type User = {
 *  id: string
 *  username: string
 *  password: string
 *  createdAt: Date
 * }
 *
 * Optional<User, 'id' | 'createdAt'>
 * ```
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
