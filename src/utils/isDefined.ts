export default function isDefined<TValue>(
  value: TValue | null | undefined,
): value is TValue {
  return value !== null;
}
