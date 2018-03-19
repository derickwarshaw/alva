import * as React from 'react';
import * as MobX from 'mobx';
import { observer } from 'mobx-react';

import PageList from './page-list';
import { PageRef } from '../../store/project/page-ref';
import { Project } from '../../store/project/project';
import { Store } from '../../store/store';

export interface PageListContainerProps {
	store: Store;
}

@observer
export default class PageListContainer extends React.Component<PageListContainerProps> {
	@MobX.observable protected pageElementEditable: boolean = false;
	public render(): JSX.Element {
		return <PageList pages={this.getProjectPages()} />;
	}

	public getProjectPages(): PageRef[] {
		const project: Project | undefined = this.props.store.getCurrentProject();
		return project ? project.getPages() : [];
	}
}
