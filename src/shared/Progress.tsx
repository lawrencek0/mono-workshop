import React from 'react';
import styled from 'styled-components/macro';
import tw from 'tailwind.macro';
import { animated, useSpring, config } from 'react-spring';

const Progress: React.FC<{ className?: string }> = ({ className }) => {
    const left = useSpring({
        to: async next => {
            while (true) {
                await next({ left: '100%' });
                await next({ left: '-35%' });
            }
        },
        config: config.slow,
        from: { left: '-35%' },
    });

    return (
        <Wrapper className={className}>
            <Line style={left} />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    ${tw`w-full h-1 bg-blue-200 overflow-x-hidden`}
`;

const Line = styled(animated.div)`
    ${tw`absolute w-1/3 h-1 bg-blue-400`}
`;

export { Progress };
