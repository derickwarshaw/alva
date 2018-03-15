import { PageCommand } from './page-command';
import { PageElement } from '../page-element';

/**
 * A user operation to set the value of a page element property.
 */
export class PropertyValueCommand extends PageCommand {
	private element: PageElement;
	private path?: string;
	private propertyId: string;

	// tslint:disable-next-line:no-any
	private value: any;

	// tslint:disable-next-line:no-any
	private previousValue: any;

	// tslint:disable-next-line:no-any
	public constructor(element: PageElement, propertyId: string, value: any, path?: string) {
		super();
		this.element = element;
		this.propertyId = propertyId;
		this.value = value;
		this.path = path;
		this.previousValue = element.getPropertyValue(propertyId, path);
	}

	/**
	 * @inheritDoc
	 */
	public execute(): boolean {
		this.element.setPropertyValue(this.propertyId, this.value, this.path);
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public maybeMergeWith(previousCommand: PageCommand): boolean {
		if (previousCommand.getType() !== this.getType()) {
			return false;
		}

		const previousPropertyCommand: PropertyValueCommand = previousCommand as PropertyValueCommand;
		if (
			previousPropertyCommand.element.getId() !== this.element.getId() ||
			previousPropertyCommand.propertyId !== this.propertyId
		) {
			return false;
		}

		previousPropertyCommand.value = this.value;
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public getType(): string {
		return 'set-property-value';
	}

	/**
	 * @inheritDoc
	 */
	public undo(): boolean {
		this.element.setPropertyValue(this.propertyId, this.previousValue, this.path);
		return true;
	}
}
