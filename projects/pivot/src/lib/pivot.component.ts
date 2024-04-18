// External modules
import { Component, HostBinding, Input, OnChanges, TrackByFunction } from "@angular/core";
import * as Enumerable from "linq";

// Interfaces
import { IPivotColumns } from "./interfaces/columns.interface";
import { IPivotNodes } from "./interfaces/nodes.interface";
import { IPivotColumn } from "./interfaces/column.interface";
import { IPivotNode } from "./interfaces/node.interface";

// Enums
import { PivotColumnType } from "./enums/column-type.enum";

@Component({
	selector: "ngx-pivot",
	templateUrl: "./pivot.component.html",
	styleUrls: ["./pivot.component.scss"]
})
export class PivotComponent implements OnChanges {

	@HostBinding("class.ngx-pivot")
	public hasDefaultClass: boolean = true;

	@Input("columns")
	public columns: IPivotColumns = [];

	@Input("data")
	public data: any[] = [];

	// Nodes
	public nodes: IPivotNodes<any> = [];

	/**
	 * Track by column function
	 * @param index 
	 * @param column 
	 * @returns 
	 */
	public trackColumnByFn: TrackByFunction<IPivotColumn> = (index, column) => column.key;

	/**
	 * On changes
	 */
	public async ngOnChanges(): Promise<void> {
		// Rebuild
		await this.rebuild();
	}

	/**
	 * On toggle node click
	 * @param event 
	 * @param node 
	 */
	public onToggleNodeClick(event: Event, node: IPivotNode<any>): void {
		// Prevent event propagation
		event.stopPropagation();

		// Toggle node
		this.toggleNode(node);
	}

	/**
	 * Rebuild
	 * @description Rebuild pivot
	 */
	public async rebuild(): Promise<void> {
		// Get string columns
		const sColumns = Enumerable.from(this.columns || []).where((x) => x.isActive && x.type === PivotColumnType.String).toArray();

		// Build node
		this.nodes = await this.buildNodes<any>(sColumns, this.data);
	}

	/**
	 * Expand call
	 * @description Expand all nodes
	 */
	public async expandAll(): Promise<void> {
		// Expand nodes
		for (let index = 0; index < (this.nodes || []).length; index++) {
			// Get node
			const node = this.nodes[index];

			// Expand node
			await this.expandNode(node);
		}
	}

	/**
	 * Collapse all
	 * @description Collapse all nodes
	 */
	public async collapseAll(): Promise<void> {
		// Collapse nodes
		for (let index = 0; index < (this.nodes || []).length; index++) {
			// Get node
			const node = this.nodes[index];

			// Collapse node
			await this.collapseNode(node);
		}
	}

	/**
	 * Collapse node
	 * @param node 
	 */
	private async collapseNode(node: IPivotNode): Promise<void> {
		// Collapse children nodes
		for (let index = 0; index < (node.nodes || []).length; index++) {
			// Get node
			const child = node.nodes[index];

			// Collapse node
			await this.collapseNode(child);
		}

		// Collapse node
		node.isExpanded = false;
	}

	/**
	 * Expand node
	 * @param node 
	 */
	private async expandNode(node: IPivotNode): Promise<void> {
		// Expand children nodes
		for (let index = 0; index < (node.nodes || []).length; index++) {
			// Get node
			const child = node.nodes[index];

			// Expand node
			await this.expandNode(child);
		}

		// Expand node
		node.isExpanded = true;
	}

	/**
	 * Build node
	 * @param columns 
	 * @param data 
	 */
	private async buildNodes<TData>(columns: IPivotColumns, data: any[]): Promise<IPivotNodes<TData>> {
		// Check if both columns and data are set
		if (!(columns || []).length || !(data || []).length) {
			return [];
		}

		// Init nodes
		const nodes: IPivotNodes<TData> = [];

		// Get first column
		const column: IPivotColumn = columns[0];

		// Get number columns
		const nColumns = Enumerable.from(this.columns || []).where((x) => x.isActive && x.type === PivotColumnType.Number).toArray();

		// Create enumerable from data
		const eData = Enumerable.from(data || []);

		// Group data by column key
		const groups = eData.groupBy((x) => x[column.key]).orderBy((x) => x.key()).toArray();

		// Iterate groups
		for (let index = 0; index < groups.length; index++) {
			// Get group
			const group = groups[index];

			// Create new node
			const node: IPivotNode<TData> = { data: {} as any };

			// Set node data column value
			node.data[column.key] = group.key();

			// Now iterate number columns to calculate its values
			for (let nIndex = 0; nIndex < nColumns.length; nIndex++) {
				// Get column
				const nColumn = nColumns[nIndex];

				// Calculate value
				node.data[nColumn.key] = group.sum((x) => x[nColumn.key] || 0);
			}

			// Build nodes
			node.nodes = await this.buildNodes(columns.slice(1), group.toArray());

			// Add node to list
			nodes.push(node);
		}

		// Return nodes
		return nodes;
	}

	/**
	 * Toggle node
	 * @param node 
	 */
	private async toggleNode(node: IPivotNode<any>): Promise<void> {
		// Toggle node
		node.isExpanded = !node.isExpanded;
	}
}
