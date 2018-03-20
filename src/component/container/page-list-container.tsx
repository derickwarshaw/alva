import * as MobX from 'mobx';
import * as React from 'react';

import { observer } from 'mobx-react';
import { PageList } from './page-list';
import { PageRef } from '../../store/project/page-ref';
import { Project } from '../../store/project/project';

import { Store } from '../../store/store';

export interface PageListContainerProps {
	store: Store;
}

@observer
export class PageListContainer extends React.Component<PageListContainerProps> {
	@MobX.observable protected activePage: string = '';
	@MobX.observable protected activeTitle: string = '';
	@MobX.observable protected focusedPage: boolean = false;
	@MobX.observable protected editablePage: boolean = false;

	public render(): JSX.Element {
		return (
			<div onClick={e => this.handleClick(e)}>
				<PageList
					activeId={this.activePage}
					editable={false}
					focused={this.focusedPage}
					onFocus={() => this.handleFocus}
					pages={this.getProjectPages()}
				/>
			</div>
		);
	}

	protected getProjectPages(): PageRef[] {
		const project: Project | undefined = this.props.store.getCurrentProject();
		return project ? project.getPages() : [];
	}

	protected getActivePage(target: HTMLElement, name: string): string | void {
		const ids: string[] = this.getProjectPages().map(page => page.getId());
		const data = target.dataset;

		ids.forEach((id: string) => {
			if (id === data[name]) {
				console.log(data[name], name, data);
				return (this.activePage = data[name] || '');
			}
			return '';
		});
	}

	protected handleClick(e: React.MouseEvent<HTMLElement>): void {
		e.preventDefault();
		this.getActivePage(e.target as HTMLElement, 'id');
	}

	protected handleDoubleClick(e: React.MouseEvent<HTMLElement>): void {
		e.preventDefault();
		this.getActivePage(e.target as HTMLElement, 'titleId');
	}

	protected handleEditMode(): boolean {
		return (this.editablePage = !this.editablePage);
	}
	protected handleFocus(): void {
		this.focusedPage = !this.focusedPage;
	}
}
