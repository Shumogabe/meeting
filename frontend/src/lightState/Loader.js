/*
 *  @2019 CS-Core project.
 *
 */

import React from "react";
import LightState from "react-light-state";
import styled, { css } from "styled-components";
import uuid from "uuid/v4";
import SpinnerImage from "../assets/images/spiner.png";

const LoaderStore = new LightState({ stacks: [] }, "loader");

export default LoaderStore;

export function remove(key) {
  LoaderStore.setState((setState, getState) => {
    setState({ stacks: getState().stacks.filter((o) => o.key !== key) });
  });
}

export function add() {
  const key = uuid();
  LoaderStore.setState((setState, getState) => {
    setState({ stacks: [...getState().stacks, { key }] });
  });

  return () => remove(key);
}

// render
export const LoaderComponent = LoaderStore.withLight()(({ loader }) => (
  <Spin isShow={loader.stacks.length} />
));

const Loading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  height: 4px;
  width: 100%;
  background: rgb(247,207,59);
  background: linear-gradient(90deg, rgba(247,207,59,1), rgba(247,207,59,1), rgba(229,113,46,1), rgba(247,207,59,1), rgba(229,113,46,1), rgba(247,207,59,1));
  background-size: 500%;

  animation: 2s linear infinite LoadingBarProgress;
    0.5s ease-out LoadingBarEnter;
  transform-origin: left;
  width: 100%;
  @keyframes LoadingBarProgress {
    0% {
      background-position: 0% 0;
    }
    to {
      background-position: 125% 0;
    }
  }
  @keyframes LoadingBarEnter {
    0% {
      -webkit-transform: scaleX(0);
      transform: scaleX(0);
    }
    to {
      -webkit-transform: scaleX(1);
      transform: scaleX(1);
    }
  }
  opacity: 0;
  transition: all 0.5s;
  ${(props) =>
    props.show &&
    css`
      opacity: 1;
      display: block;
    `}
`;

const Spin = ({ isShow }) => {
  return isShow ? (
    <SpinWrapper>
      <img className="load-img" src={SpinnerImage} alt="" />
    </SpinWrapper>
  ) : (
    ""
  );
};

const SpinWrapper = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(103, 103, 103, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  flex-direction: column;
  .load-img {
    animation: spin 1.5s linear infinite;
    width: 40px;
    height: 40px;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
