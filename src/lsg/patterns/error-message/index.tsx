import * as React from 'react';
import styled from 'styled-components';

export interface ErrorMessageProps {
	error: Error;
	patternName: string;
}

const StyledErrorMessage = styled.div`
	border: 10px solid red;
	padding: 8px;
`;

export const ErrorMessage: React.StatelessComponent<ErrorMessageProps> = props => (
	<StyledErrorMessage>
		{props.patternName} failed to render: {props.error}
	</StyledErrorMessage>
);
