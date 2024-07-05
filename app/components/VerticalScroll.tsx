"use client";
// import throttle from "lodash/throttle";
import debounce from "lodash/debounce";

import { useEffect, useCallback, useReducer } from "react";

type SwipeDirection = "neutral" | "up" | "down";
type SwipeSpeed = "none" | "slow" | "fast";
type SwipeState = "idle" | "active" | "disabled";

type ReducerState = {
  swipeDirection: SwipeDirection;
  swipeSpeed: SwipeSpeed;
  status: SwipeState;
  activeMenuIndex: number;
};

type Action =
  | { type: "SHORT_SWIPE"; payload: { swipeDirection: SwipeDirection } }
  | { type: "SWIPE_DIRECTION"; payload: SwipeDirection }
  | { type: "SWIPE_SPEED"; payload: SwipeSpeed }
  | { type: "SET_INDEX"; payload: number }
  | { type: "RESET_SWIPE_STATE" };

const defaultState: ReducerState = {
  swipeDirection: "neutral",
  swipeSpeed: "none",
  status: "idle",
  activeMenuIndex: 0,
};

function mouseWheelReducer(state: ReducerState, action: Action): ReducerState {
  if (state.status === "disabled" && action.type !== "RESET_SWIPE_STATE")
    return state;
  console.log("reducer", action);
  switch (action.type) {
    case "SHORT_SWIPE": {
      // TODO: make a change to the index and then reset
      const indexChange = action.payload.swipeDirection === "down" ? -1 : 1;
      const currIndex = state.activeMenuIndex;
      const newIndex =
        currIndex + indexChange >= 0 && currIndex + indexChange < 5
          ? currIndex + indexChange
          : currIndex;

      return {
        activeMenuIndex: newIndex,
        status: "disabled",
        swipeSpeed: "slow",
        swipeDirection: action.payload.swipeDirection,
      };
    }
    case "SWIPE_DIRECTION": {
      return { ...state, swipeDirection: action.payload };
    }
    case "SWIPE_SPEED": {
      return { ...state, swipeSpeed: action.payload };
    }
    case "SET_INDEX": {
      return { ...state, activeMenuIndex: action.payload };
    }
    case "RESET_SWIPE_STATE": {
      return {
        ...defaultState,
        activeMenuIndex: state.activeMenuIndex,
        status: "idle",
      };
    }
    default: {
      throw new Error(`Unhandled type: ${action}`);
    }
  }
}

function useMouseWheel({ reducer = mouseWheelReducer } = {}) {
  const [{ activeMenuIndex, status }, dispatch] = useReducer(
    reducer,
    defaultState
  );

  const shortSwipe = (dir: SwipeDirection) => {
    dispatch({ type: "SHORT_SWIPE", payload: { swipeDirection: dir } });
  };

  const resetSwipeState = () => {
    dispatch({ type: "RESET_SWIPE_STATE" });
  };

  return {
    activeMenuIndex,
    status,
    shortSwipe,
    resetSwipeState,
  };
}

export const VerticalScroll = () => {
  const listItems = [
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
  const LONG_SWIPE_THRESHOLD = 5;

  const { activeMenuIndex, status, shortSwipe, resetSwipeState } =
    useMouseWheel();

  const debouncedReset = useCallback(
    debounce(
      () => {
        resetSwipeState();
      },
      100,
      { leading: false, trailing: true }
    ),
    []
  );

  console.log("mousewheel status", activeMenuIndex);

  // TODO: detect short / vs long swipe
  const handleScroll = (event: WheelEvent) => {
    console.log("SWIPING");
    debouncedReset();
    const scroll = event.deltaY;

    if (status !== "disabled") {
      console.log("scroll delta", scroll);
      const isAboveLongSwipeThreshold =
        Math.abs(scroll) >= LONG_SWIPE_THRESHOLD;

      const direction: SwipeDirection = scroll < 0 ? "up" : "down";

      if (!isAboveLongSwipeThreshold) {
        // console.info("short swipe", scroll);
        shortSwipe(direction);
      }
    }
  };

  const debouncedHandler = handleScroll;

  useEffect(() => {
    window.addEventListener("wheel", debouncedHandler, { passive: true });
    return () => {
      window.addEventListener("wheel", debouncedHandler, { passive: true });
    };
  }, [debouncedHandler]);

  return (
    <div className="vertical-scroll-container">
      <div className="scroll-content">
        <ul>
          {listItems.map((item, index) => (
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
