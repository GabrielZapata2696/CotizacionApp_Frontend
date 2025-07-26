import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { 
  homeOutline, 
  documentTextOutline, 
  imageOutline, 
  documentOutline, 
  chatbubbleOutline, 
  colorPaletteOutline, 
  extensionPuzzleOutline, 
  peopleOutline, 
  settingsOutline, 
  constructOutline, 
  moonOutline, 
  logOutOutline, 
  appsOutline, 
  chevronForwardOutline, 
  chevronBackOutline, 
  menuOutline,
  // New menu icons
  gridOutline,
  personCircleOutline,
  peopleCircleOutline,
  cogOutline,
  analyticsOutline,
  chatbubblesOutline,
  calendarClearOutline,
  checkboxOutline,
  folderOpenOutline,
  notificationsOutline,
  helpBuoyOutline,
  informationOutline,
  enterOutline,
  sunnyOutline
} from 'ionicons/icons';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Register icons
addIcons({
  'home-outline': homeOutline,
  'document-text-outline': documentTextOutline,
  'image-outline': imageOutline,
  'document-outline': documentOutline,
  'chatbubble-outline': chatbubbleOutline,
  'color-palette-outline': colorPaletteOutline,
  'extension-puzzle-outline': extensionPuzzleOutline,
  'people-outline': peopleOutline,
  'settings-outline': settingsOutline,
  'construct-outline': constructOutline,
  'moon-outline': moonOutline,
  'log-out-outline': logOutOutline,
  'apps-outline': appsOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'chevron-back-outline': chevronBackOutline,
  'menu-outline': menuOutline,
  // New menu icons
  'grid-outline': gridOutline,
  'person-circle-outline': personCircleOutline,
  'people-circle-outline': peopleCircleOutline,
  'cog-outline': cogOutline,
  'analytics-outline': analyticsOutline,
  'chatbubbles-outline': chatbubblesOutline,
  'calendar-clear-outline': calendarClearOutline,
  'checkbox-outline': checkboxOutline,
  'folder-open-outline': folderOpenOutline,
  'notifications-outline': notificationsOutline,
  'help-buoy-outline': helpBuoyOutline,
  'information-outline': informationOutline,
  'enter-outline': enterOutline,
  'sunny-outline': sunnyOutline
});

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
