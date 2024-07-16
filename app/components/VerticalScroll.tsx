"use client";
import { throttle, debounce } from "lodash";
import { useEffect, useCallback, useReducer, useRef } from "react";

type SwipeDirection = "neutral" | "up" | "down";

type ReducerState = {
  swipeDirection: SwipeDirection;
  activeMenuIndex: number;
  menuItems: string[];
};

type Action =
  | { type: "SCROLL"; payload: { swipeDirection: SwipeDirection } }
  | { type: "RESET_SCROLL_STATE" };

const defaultState: ReducerState = {
  swipeDirection: "neutral",
  activeMenuIndex: 0,
  menuItems: [],
};

function mouseWheelReducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case "SCROLL": {
      const indexChange = action.payload.swipeDirection === "down" ? -1 : 1;
      const currIndex = state.activeMenuIndex;
      const newIndex =
        currIndex + indexChange >= 0 &&
        currIndex + indexChange < state.menuItems.length
          ? currIndex + indexChange
          : currIndex;

      return {
        ...state,
        activeMenuIndex: newIndex,
        swipeDirection: action.payload.swipeDirection,
      };
    }
    case "RESET_SCROLL_STATE": {
      return {
        ...state,
        activeMenuIndex: state.activeMenuIndex,
      };
    }
    default: {
      throw new Error(`Unhandled type: ${action}`);
    }
  }
}

function useMouseWheel({
  reducer = mouseWheelReducer,
  menuItems = ["first item"],
} = {}) {
  const [{ activeMenuIndex }, dispatch] = useReducer(reducer, {
    ...defaultState,
    menuItems,
  });

  const scroll = (dir: SwipeDirection) => {
    dispatch({ type: "SCROLL", payload: { swipeDirection: dir } });
  };

  const resetScrollState = () => {
    dispatch({ type: "RESET_SCROLL_STATE" });
  };

  return {
    activeMenuIndex,
    scroll,
    resetScrollState,
  };
}

type Props = {
  menuItems: string[];
};

const defaultItems = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
];

export const VerticalScroll = ({ menuItems = defaultItems }: Props) => {
  const latestYDelta = useRef<number>(0);

  const { activeMenuIndex, scroll, resetScrollState } = useMouseWheel({
    menuItems,
  });

  const debouncedReset = useCallback(
    debounce(
      () => {
        latestYDelta.current = 0;
        resetScrollState();
      },
      100,
      { leading: false, trailing: true }
    ),
    []
  );

  const handleScroll = (event: WheelEvent) => {
    debouncedReset();
    const scrollDelta = event.deltaY;

    if (Math.abs(scrollDelta) > Math.abs(latestYDelta.current)) {
      const direction: SwipeDirection = scrollDelta < 0 ? "up" : "down";

      scroll(direction);
    }
    latestYDelta.current = scrollDelta;
  };

  const throttledScrollHandler = throttle(handleScroll, 50, { leading: true });

  useEffect(() => {
    window.addEventListener("wheel", throttledScrollHandler, { passive: true });
    return () => {
      window.addEventListener("wheel", throttledScrollHandler, {
        passive: true,
      });
    };
  }, [throttledScrollHandler]);

  return (
    <div className="vertical-scroll-container">
      <div className="scroll-content">
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={`${index}-${item}`}
              className={index === activeMenuIndex ? "focus" : ""}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
