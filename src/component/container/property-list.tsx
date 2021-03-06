import { BooleanItem } from '../../lsg/patterns/property-items/boolean-item';
import Element from '../../lsg/patterns/element';
import { EnumItem, Values } from '../../lsg/patterns/property-items/enum-item';
import { EnumProperty, Option } from '../../store/styleguide/property/enum-property';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { ObjectProperty } from '../../store/styleguide/property/object-property';
import { PageElement } from '../../store/page/page-element';
import { PropertyValue } from '../../store/page/property-value';
import * as React from 'react';
import { Store } from '../../store/store';
import { StringItem } from '../../lsg/patterns/property-items/string-item';

interface ObjectContext {
	path: string;
	property: ObjectProperty;
}

interface PropertyTreeProps {
	context?: ObjectContext;
	element: PageElement;
}

@observer
class PropertyTree extends React.Component<PropertyTreeProps> {
	@observable protected isOpen = false;

	public constructor(props: PropertyTreeProps) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	public render(): React.ReactNode {
		const { context } = this.props;

		if (!context) {
			return this.renderItems();
		}

		const { property } = context;

		return (
			<Element title={property.getName()} open={this.isOpen} handleClick={this.handleClick}>
				{this.renderItems()}
			</Element>
		);
	}

	protected renderItems(): React.ReactNode {
		const { context, element } = this.props;
		const pattern = element.getPattern();

		const properties = context
			? context.property.getProperties()
			: pattern && pattern.getProperties();

		if (!properties) {
			return <div>This element has no properties</div>;
		}

		return (
			<>
				{properties.map(property => {
					const id = property.getId();
					const name = property.getName();
					const type = property.getType();
					const value = this.getValue(id, context && context.path);

					switch (type) {
						case 'boolean':
							return (
								<BooleanItem
									key={id}
									label={name}
									checked={value as boolean}
									handleChange={event => this.handleChange(id, !value, context)}
								/>
							);

						case 'string':
							return (
								<StringItem
									key={id}
									label={name}
									value={value as string}
									handleChange={event =>
										this.handleChange(id, event.currentTarget.value, context)
									}
								/>
							);

						case 'enum':
							const options = (property as EnumProperty).getOptions();
							const option: Option | undefined = (property as EnumProperty).getOptionById(
								value as string
							);

							return (
								<EnumItem
									key={id}
									label={name}
									selectedValue={option && option.getId()}
									values={this.convertOptionsToValues(options)}
									handleChange={event =>
										this.handleChange(id, event.currentTarget.value, context)
									}
								/>
							);

						case 'object':
							const objectProperty = property as ObjectProperty;
							const newPath = (context && `${context.path}.${id}`) || id;

							const newContext: ObjectContext = {
								path: newPath,
								property: objectProperty
							};

							return <PropertyTree key={id} context={newContext} element={element} />;

						default:
							return <div key={id}>Unknown type: {type}</div>;
					}
				})}
			</>
		);
	}

	// tslint:disable-next-line:no-any
	protected handleChange(id: string, value: any, context?: ObjectContext): void {
		if (context) {
			const parts = `${context.path}.${id}`.split('.');
			const [rootId, ...path] = parts;

			this.props.element.setPropertyValue(rootId, value, path.join('.'));
			return;
		}

		this.props.element.setPropertyValue(id, value);
	}

	protected getValue(id: string, path?: string): PropertyValue {
		if (path) {
			const parts = `${path}.${id}`.split('.');
			const [rootId, ...propertyPath] = parts;

			return this.props.element.getPropertyValue(rootId, propertyPath.join('.'));
		}

		return this.props.element.getPropertyValue(id);
	}

	@action
	protected handleClick(): void {
		this.isOpen = !this.isOpen;
	}

	protected convertOptionsToValues(options: Option[]): Values[] {
		return options.map(option => ({
			id: option.getId(),
			name: option.getName()
		}));
	}
}

export interface PropertyListProps {
	store: Store;
}

@observer
export class PropertyList extends React.Component<PropertyListProps> {
	public constructor(props: PropertyListProps) {
		super(props);
	}

	public render(): React.ReactNode {
		const selectedElement = this.props.store.getSelectedElement();

		if (!selectedElement) {
			return <div>No Element selected</div>;
		}

		return <PropertyTree element={selectedElement} />;
	}
}
