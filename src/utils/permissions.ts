
type SupportedPermission = 'clipboardWrite';
type Permissions = Array<SupportedPermission>;
type PermissionsOptions = { permissions: Permissions };

export function withPermissionsCheck<T extends (...args: any[]) => any>(
  options: PermissionsOptions,
  callback: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>) => {
    const granted = await chrome.permissions.request(options);
    if (granted) {
      return callback(...args);
    }
    throw new Error('权限未授予');
  };
} 