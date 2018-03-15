/**
 * A user operation on a page, with the ability to undo and redo.
 * @see Store.execute()
 * @see Store.undo()
 * @see Store.redo()
 */
export abstract class PageCommand {
	/**
	 * Performs this page operation (forward execute or redo).
	 * @return Whether the execution was successful.
	 * Returning false will drop the undo and redo buffers, as the page state is unknown then.
	 */
	public abstract execute(): boolean;

	/**
	 * Returns the type of this page command (a string derived from the class name).
	 * This can be used to determine whether a page command can combine with a previous one,
	 * to reduce similar undo steps.
	 */
	public abstract getType(): string;

	/**
	 * Looks at a given previous command, checking whether the types are compatible
	 * and the changes are too similar to keep both. If so, the method modifies the previous
	 * command and returns true, indicating not to put this newer command into the undo buffer.
	 * @param previousCommand The previous command.
	 * @return Whether the method has merged itself into the previous command.
	 * <code>false</code> keeps both methods separate.
	 */
	public maybeMergeWith(previousCommand: PageCommand): boolean {
		return false;
	}

	/**
	 * Reverts this page operation (undo).
	 * @return Whether the revert was successful.
	 * Returning false will drop the undo and redo buffers, as the page state is unknown then.
	 */
	public abstract undo(): boolean;
}
