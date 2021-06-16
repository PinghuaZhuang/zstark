import SensorAbs from '../src/SensorAbs'
import EventAbs from '../src/EventAbs'

class TrackClickEvent extends EventAbs<{
  name: string;
}> {
  public static readonly type: string = 'track-click'
}

class TrackClick extends SensorAbs<TrackClickEvent> {
  public attach() {
    console.error(`<<< Please implement the attach function.`, this.type)
  }
  public detach() {
    console.error(`<<< Please implement the detach function.`, this.type)
  }
}

export default TrackClick
