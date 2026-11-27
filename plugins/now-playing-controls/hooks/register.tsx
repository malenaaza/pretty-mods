import type { Register } from 'claude-code'

import { type Action, describe } from './controls.js'

const TIMEOUT_MS = 8000
const PANE = 'now-playing-controls'

// Each command and the pane are terminal-only: they act on this computer, which a desktop or phone client does not share.
const SPEC = { isTerminalOnly: true } as const

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'next-song', description: 'Skip to the next song', ...SPEC })
    await $.command.register({ name: 'previous-song', description: 'Go back to the previous song', ...SPEC })
    await $.command.register({ name: 'play-pause', description: 'Play or pause the song', ...SPEC })
    await $.command.register({ name: 'playback', description: 'Show the playback buttons in a pane', ...SPEC })

    return next(e)
  })

  on('command.run', { command: 'next-song' }, async $ => ({
    text: await describe('next', argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })),
  }))

  on('command.run', { command: 'previous-song' }, async $ => ({
    text: await describe('previous', argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })),
  }))

  on('command.run', { command: 'play-pause' }, async $ => ({
    text: await describe('playpause', argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })),
  }))

  on('command.run', { command: 'playback' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Now playing' })

    return { text: 'Playback buttons opened.' }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)

    // Each button runs its action and shows the result as a toast.
    const press = (action: Action) => async () => {
      $.ui.toast(await describe(action, argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })))
    }

    return (
      <Box flexDirection="column">
        <Text dimColor>Controls the song that's playing.</Text>
        <Box flexDirection="row">
          <Button key="previous" onPress={press('previous')}>⏮ Previous</Button>
          <Button key="playpause" onPress={press('playpause')}>⏯ Play / pause</Button>
          <Button key="next" onPress={press('next')}>⏭ Next</Button>
        </Box>
      </Box>
    )
  })
}
