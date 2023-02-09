// eslint-disable-next-line import/no-extraneous-dependencies
import {
  animate,
  AnimationOptions,
  motion,
  MotionStyle,
  PanInfo,
  useMotionValue,
} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import {Content} from './Content';

const range = [-1, 0, 1];

interface VirtualizedContentProps {
  children: (props: {index: number}) => JSX.Element;
}

const containerStyle: MotionStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflowX: 'hidden',
};

const transition: AnimationOptions<unknown> = {
  type: 'spring',
  bounce: 0,
};

export function VirtualizedContent({
  children,
}: VirtualizedContentProps): JSX.Element {
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const calculateNewX = () => -index * (containerRef.current?.clientWidth || 0);

  const handleEndDrag = (e: Event, dragProps: PanInfo) => {
    const clientWidth = containerRef.current?.clientWidth || 0;

    const {offset, velocity} = dragProps;

    if (Math.abs(velocity.y) > Math.abs(velocity.x)) {
      animate(x, calculateNewX(), transition);
      return;
    }

    if (offset.x > clientWidth / 4) {
      setIndex(index - 1);
    } else if (offset.x < -clientWidth / 4) {
      setIndex(index + 1);
    } else {
      animate(x, calculateNewX(), transition);
    }
  };

  useEffect(() => {
    const controls = animate(x, calculateNewX(), transition);
    return controls.stop;
  }, [index]);

  return (
    <motion.div ref={containerRef} style={containerStyle}>
      {range.map((rangeValue) => {
        return (
          <Content
            key={rangeValue + index}
            x={x}
            onDragEnd={handleEndDrag}
            index={rangeValue + index}
            renderContent={children}
          />
        );
      })}
    </motion.div>
  );
}
