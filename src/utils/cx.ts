/**
 * Une clases ignorando las vacías.
 * cx('p-4', '', false, 'bg-red-500') -> 'p-4 bg-red-500'
 */
export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
