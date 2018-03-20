import * as React from 'react';

import Layout from '../../lsg/patterns/layout';
import PreviewTile from '../../lsg/patterns/preview-tile';
import Space, { Size } from '../../lsg/patterns/space';
import { PageRef } from '../../store/project/page-ref';

export interface PageListProps {
	activeId: string;
	editable: boolean;
	focused: boolean;
	handleFocus: any;
	onClick?: React.MouseEventHandler<HTMLElement>;
	pages: PageRef[];
}

const PageList: React.StatelessComponent<PageListProps> = (props): JSX.Element => {
	return (
		<Layout>
			{props.pages.map((page: PageRef, i: number) => {
				console.log(props, 'this are props');
				let focused = false;
				if (page.getId() === props.activeId) {
					focused = props.handleFocus();
				}
				return (
					<Space key={i} size={Size.S}>
						<PreviewTile
							id={page.getId()}
							editable={false}
							focused={focused}
							name={page.getName()}
							value={'placeholder'}
						/>
					</Space>
				);
			})}
		</Layout>
	);
};

export default PageList;
