import * as React from 'react';
import * as MobX from 'mobx';
import { observer } from 'mobx-react';

import PageList from './page-list';
import { PageRef } from '../../store/project/page-ref';
import { Project } from '../../store/project/project';
import { Store } from '../../store/store';

export interface PageListContainerProps {
	focused?: boolean;
	handleClick?: React.MouseEventHandler<HTMLElement>;
	store: Store;
}

@observer
export default class PageListContainer extends React.Component<PageListContainerProps> {
	@MobX.observable protected focusedPage: boolean = false;
	@MobX.observable protected activePage: string = '';

	public render(): JSX.Element {
		return (
			<div onClick={e => this.handleClick(e)}>
				<PageList
					activeId={this.activePage}
					editable={false}
					handleFocus={() => this.handleFocus}
					focused={this.focusedPage}
					pages={this.getProjectPages()}
				/>
			</div>
		);
	}

	public getProjectPages(): PageRef[] {
		const project: Project | undefined = this.props.store.getCurrentProject();
		return project ? project.getPages() : [];
	}

	public handleFocus(): void {
		this.focusedPage = !this.focusedPage;
	}

	protected getActivePage(target: HTMLElement): string | void {
		const ids: string[] = this.getProjectPages().map(page => page.getId());
		ids.forEach((id: string) => {
			if (id === target.dataset.id) {
				console.log(target.dataset.id, 'active  Id');
				return (this.activePage = target.dataset.id || '');
			}
			return;
		});
	}

	protected handleClick(e: any): void {
		this.getActivePage(e.target);
	}
}
