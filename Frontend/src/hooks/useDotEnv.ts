export default function useDotEnv (varName: string) {
  return import.meta.env[varName];
}