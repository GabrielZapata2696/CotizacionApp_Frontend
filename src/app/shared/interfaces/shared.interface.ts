
export interface SidebarMenuItem {
  label: string;           // Texto a mostrar en el ion-label
  icon: string;            // Nombre del ion-icon
  routerLink: string;      // Ruta de navegación
  rol?: string;             // Rol requerido para mostrar el item
  authenticated?: boolean; // Si requiere autenticación (opcional)
}
