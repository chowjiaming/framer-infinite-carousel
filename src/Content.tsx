// eslint-disable-next-line import/no-extraneous-dependencies
import {motion, MotionStyle, MotionValue, PanInfo} from 'framer-motion';
import {useMemo} from 'react';

interface ContentProps {
  index: number;
  renderContent: (props: {index: number}) => JSX.Element;
  x: MotionValue;
  onDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo): void;
}

const contentStyle: MotionStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
};

export function Content({
  index,
  renderContent,
  x,
  onDragEnd,
}: ContentProps): JSX.Element {
  const child = useMemo(() => renderContent({index}), [index, renderContent]);

  return (
    <motion.div
      style={{
        ...contentStyle,
        x,
        left: `${index * 100}%`,
        right: `${index * 100}%`,
      }}
      draggable
      drag="x"
      dragElastic={1}
      onDragEnd={onDragEnd}
    >
      {child}
    </motion.div>
  );
}
