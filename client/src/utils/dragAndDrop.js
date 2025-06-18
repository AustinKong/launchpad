import {
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors as useSensorsDndKit,
} from "@dnd-kit/core";

/**
 * A custom collision detection strategy for `@dnd-kit/core` that adjusts the collision rectangle
 * to center it on the current pointer position.
 *
 * This function is intended to be used in conjunction with the `snapCenterToCursor` modifier
 * to fix issues with collision detection when dragging items with the cursor centered.
 *
 * Reference: https://github.com/clauderic/dnd-kit/pull/334#issuecomment-1965708784
 *
 * @param {import('@dnd-kit/core').CollisionDetectionArgs} args - The arguments passed to the collision detection function.
 * @returns {import('@dnd-kit/core').Collision[]} An array of collisions determined using the adjusted collision rectangle.
 */
export function fixedCursorSnapCollisionDetection(args) {
  if (!args.pointerCoordinates) return closestCenter(args);

  const { x, y } = args.pointerCoordinates;
  const { width, height } = args.collisionRect;
  const updatedArgs = {
    ...args,
    collisionRect: {
      width,
      height,
      bottom: y + height / 2,
      left: x - width / 2,
      right: x + width / 2,
      top: y - height / 2,
    },
  };

  return closestCenter(updatedArgs);
}

export function useSensors() {
  return useSensorsDndKit(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 300,
      },
    }),
  );
}
