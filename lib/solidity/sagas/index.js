import debugModule from "debug";
const debug = debugModule("debugger:solidity:sagas");

import { call, put, take, select } from "redux-saga/effects";
import { prefixName } from "lib/helpers";

import * as actions from "../actions";
import { TICK } from "lib/trace/actions";

import solidity from "../selectors";

export function *addSource(contractName, source, sourcePath, ast) {
  yield put(actions.addSource(contractName, source, sourcePath, ast));
}

export function *addSourceMap(binary, sourceMap) {
  yield put(actions.addSourceMap(binary, sourceMap));
}

function* functionDepthSaga () {
  while (true) {
    yield take(TICK);
    debug("got TICK");
    let instruction = yield select(solidity.next.instruction);
    debug("instruction: %o", instruction);

    if (yield select(solidity.next.willJump)) {
      let jumpDirection = yield select(solidity.next.jumpDirection);


      yield put(actions.jump(jumpDirection));
    }
  }
}

export function* saga () {
  yield call(functionDepthSaga);
}

export default prefixName("solidity", saga);
