import DemoContainer from '../demo-container';
import { ErrorMessage } from './index';
import * as React from 'react';

const ElementDemo: React.StatelessComponent<void> = (): JSX.Element => (
	<DemoContainer title="Error Message">
		<ErrorMessage patternName="My pattern" error={new Error('Unknown headline level H3')} />
	</DemoContainer>
);

export default ElementDemo;
