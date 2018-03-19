import * as React from 'react';
import styled from 'styled-components';

import { colors } from '../colors';
import Input, { InputTypes } from '../input';
import { getSpace, Size } from '../space';

export interface PreviewTileProps {
	editable: boolean;
	focused: boolean;
	handleChange?: React.ChangeEventHandler<HTMLInputElement>;
	name: string;
	value: string;
}

interface StyledPreviewTileProps {
	focused: boolean;
}

const StyledPreview = styled.section`
	width: 245px;
	text-align: center;
`;

const StyledPreviewTile = styled.div`
	box-sizing: border-box;
	width: inherit;
	height: 340px;
	border: 4px solid;
	border-color: ${(props: StyledPreviewTileProps) =>
		props.focused ? colors.blue40.toString() : 'transparent'};
	border-radius: 5px;
	box-shadow: 0 3px 12px ${colors.blackAlpha13.toString()};
	margin-top: ${getSpace(Size.S)}px;
	background-color: ${colors.white.toString()};
	cursor: pointer;
`;

const StyledTitle = styled.strong`
	font-size: 12px;
	font-weight: normal;
	cursor: pointer;
`;

const StyledEditableTitle = styled(Input)`
	font-size: 12px;
	font-weight: normal;
	text-align: center;
	::placeholder {
		color: ${colors.grey60.toString()};
	}
	:hover {
		::placeholder {
			color: ${colors.grey60.toString()};
		}
	}
`;

const PreviewTile: React.StatelessComponent<PreviewTileProps> = (props): JSX.Element => (
	<StyledPreview>
		{props.editable ? (
			<StyledEditableTitle
				focused={props.focused}
				handleChange={props.handleChange}
				type={InputTypes.string}
				value={props.value}
			>
				{props.name}
			</StyledEditableTitle>
		) : (
			<StyledTitle>{props.name}</StyledTitle>
		)}
		<StyledPreviewTile focused={props.focused} />
	</StyledPreview>
);

export default PreviewTile;
