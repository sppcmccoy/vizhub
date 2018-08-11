import { defer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { uiRedux } from 'vizhub-ui';
import { getCsrfToken, getVisualization } from '../selectors';

const {
  actionTypes: {
    SAVE
  },
  actionCreators: {
    saveSuccess,
    saveError
  },
  selectors: {
    getFiles,
    getVisualizationTitle
  }
} = uiRedux;

export const saveEpic = (action$, state$) =>
  action$.ofType(SAVE).pipe(
    switchMap(action => defer(async () => {
      const state = state$.value;
      const csrfToken = getCsrfToken(state);

      const visualization = getVisualization(state)

      visualization.content.files = getFiles(state);
      visualization.info.title = getVisualizationTitle(state);

      const url = `/api/visualization/save`;
      const options = {
        credentials: 'include',
        method: 'POST',
        headers: {
          'x-csrf-token': csrfToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visualization
        })
      };
      const response = await (await fetch(url, options)).json();

      return response.error
        ? saveError(response.error)
        : saveSuccess();
    }))
  );
