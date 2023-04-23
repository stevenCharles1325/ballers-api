export default interface PermissionContract {
  name: string;
  value: string;
  role: 'Administrator' | 'Owner' | 'Player' | 'Seller' | 'Shop';
  description?: string | null;
}