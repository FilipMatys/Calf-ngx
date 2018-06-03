// External modules
import { NgModule, ModuleWithProviders } from '@angular/core';

// Components
import { IconComponent } from './icon.component';

// Interfaces
import { IIconModuleConfig } from './interfaces/icon.interfaces';

// Tokens
import { ICON_CONFIG } from './tokens/config.token';

@NgModule({
  declarations: [IconComponent],
  exports: [IconComponent]
})
export class IconModule { 

  /**
   * Configure module
   * @param config 
   */
  public configure(config: IIconModuleConfig): ModuleWithProviders {
    return {
      ngModule: IconModule,
      providers: [
        { provide: ICON_CONFIG, useValue: config }
      ]
    }
  }
}