import { PageCommand } from './page-command';
import { PageElement } from '../page-element';

/**
 * A user operation to add or remove a child to/from a parent, or to relocate it.
 */
export class ElementCommand extends PageCommand {
	private child: PageElement;
	private index?: number;
	private parent?: PageElement;
	private previousIndex?: number;
	private previousParent?: PageElement;

	public constructor(child: PageElement, parent?: PageElement, index?: number) {
		super();
		this.child = child;
		this.parent = parent;
		this.index = index;
		this.previousParent = child.getParent();
		this.previousIndex = this.previousParent ? child.getIndex() : undefined;
	}

	/**
	 * Creates a command to add a child element to a given parent element
	 * (and remove it from any other parent).
	 * @param parent The parent to add the child to.
	 * @param child The child element to add.
	 * @param index The 0-based new position within the parent's children.
	 * Leaving out the position adds it at the end of the list.
	 * @return The new element command. To register and run the command it, call Store.execute().
	 * @see Store.execute()
	 */
	public static addChild(parent: PageElement, child: PageElement, index?: number): ElementCommand {
		return new ElementCommand(child, parent, index);
	}

	/**
	 * Creates a command to add a page element as another child of an element's parent,
	 * directly after that element. On execution, also removes the element from any previous parent.
	 * @param newSibling The element to add at a given location.
	 * @param location The element to add the new sibling after.
	 * @return The new element command. To register and run the command it, call Store.execute().
	 * @see Store.execute()
	 */
	public static addSibling(newSibling: PageElement, location: PageElement): ElementCommand {
		const parent: PageElement | undefined = location.getParent();
		return new ElementCommand(newSibling, parent, parent ? location.getIndex() + 1 : undefined);
	}

	/**
	 * Creates a command to remove a page element from its parent.
	 * You may later re-add it using a command created with addChild() or setParent().
	 * @param element The element to remove from its parent.
	 * @return The new element command. To register and run the command it, call Store.execute().
	 * @see addChild()
	 * @see setParent()
	 * @see Store.execute()
	 */
	public static remove(element: PageElement): ElementCommand {
		return new ElementCommand(element);
	}

	/**
	 * Creates a command to set a new parent for this element (and remove it
	 * from its previous parent). If no parent is provided, only removes it from its parent.
	 * @param child The element to set the new parent of.
	 * @param parent The (optional) new parent for the element.
	 * @param index The 0-based new position within the children of the new parent.
	 * Leaving out the position adds it at the end of the list.
	 * @return The new element command. To register and run the command it, call Store.execute().
	 * @see Store.execute()
	 */
	public static setParent(
		child: PageElement,
		parent: PageElement,
		index?: number
	): ElementCommand {
		return new ElementCommand(child, parent, index);
	}

	/**
	 * @inheritDoc
	 */
	public execute(): boolean {
		this.child.setParent(this.parent, this.index);
		return true;
	}

	/**
	 * @inheritDoc
	 */
	public getType(): string {
		return 'element-location';
	}

	/**
	 * @inheritDoc
	 */
	public undo(): boolean {
		this.child.setParent(this.previousParent, this.previousIndex);
		return true;
	}
}
