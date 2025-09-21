import PomodoroHistory from '@/components/pomodoro/PomodoroHistory'
import PomodoroTimer from '@/components/pomodoro/PomodoroTimer'

const Pomodoro = () => {

  

  return (
    <div>
      <PomodoroHistory sessionId={4} />
      <PomodoroTimer sessionId={4} />
    </div>
  )
}

export default Pomodoro