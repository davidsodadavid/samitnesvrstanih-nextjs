export type ImageItem = { id: number; url: string; key: string }

export type PhotoItem = { id: number; url: string; author: string | null }

export type Page<T> = { items: T[]; nextCursor: number | null }
