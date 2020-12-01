export enum DriverStageEnum {
  init = 'init',
  stopping = 'stopping',
  done = 'done',
  running = 'running',
  paused = 'paused',
  error = 'error',
}

export enum TaskStageEnum {
  init = 'init',
  running = 'running',
  error = 'error',
  dropped = 'dropped',
  done = 'done',
}
