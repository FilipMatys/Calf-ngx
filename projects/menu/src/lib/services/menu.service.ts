// External modules
import { Injectable, TemplateRef, ViewContainerRef } from "@angular/core";
import { Overlay, OverlayRef } from "@angular/cdk/overlay";
import { TemplatePortal } from "@angular/cdk/portal";
import { fromEvent, Subscription } from "rxjs";
import { take } from "rxjs/operators";

// Interfaces
import { IMenuContext } from "../interfaces/context.interface";
import { IMenuPosition } from "../interfaces/position.interface";

@Injectable({ providedIn: "root" })
export class MenuService {

    // Active subscriptions
    private subscription: Subscription;

    // Reference to overlay
    private overlayRef: OverlayRef | null;

    /**
     * Constructor
     * @param overlay 
     */
    constructor(private readonly overlay: Overlay) { }

    /**
     * Constructor
     * @param containerRef 
     * @param position 
     * @param template 
     * @param context 
     */
    public open(containerRef: ViewContainerRef, position: IMenuPosition, template: TemplateRef<any>, context?: IMenuContext): void {
        // First make sure any open menu is closed
        this.close();

        // Get position strategy
        const strategy = this.overlay.position()
            .flexibleConnectedTo({ ...position })
            .withPositions([
                {
                    originX: "end",
                    originY: "bottom",
                    overlayX: "end",
                    overlayY: "top"
                }
            ]);

        // Create overlay
        this.overlayRef = this.overlay.create({
            positionStrategy: strategy,
            scrollStrategy: this.overlay.scrollStrategies.close()
        });

        // Attach template to overlay
        this.overlayRef.attach(new TemplatePortal(template, containerRef, context));

        // Subscribe to click event to close the menu
        this.subscription = fromEvent<MouseEvent>(document, "click")
            .pipe(take(1)).subscribe(() => this.close());
    }

    public close(): void {
        // Free subscription
        this.subscription && this.subscription.unsubscribe();

        // Check if overlay is defined
        if (this.overlayRef) {
            // Dispose
            this.overlayRef.dispose();

            // Remove reference
            this.overlayRef = null;
        }
    }
}