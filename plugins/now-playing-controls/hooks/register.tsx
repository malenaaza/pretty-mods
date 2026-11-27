import type { Register } from 'claude-code'

import { type Action, describe, nowPlaying } from './controls.js'

const TIMEOUT_MS = 8000
const EVERY = 15 * 1000
const PANE = 'now-playing-controls'

// Each command and the pane are terminal-only: they act on this computer, which a desktop or phone client does not share.
const SPEC = { isTerminalOnly: true } as const

// What is playing, as last checked ("Title - Artist"), or undefined when nothing is.
// The pane and the band show their buttons only while this is set.
let track: string | undefined
// Set by the band's ✕: the row stays hidden until /playback is typed.
let dismissed = false

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'next-song', description: 'Skip to the next song', ...SPEC })
    await $.command.register({ name: 'previous-song', description: 'Go back to the previous song', ...SPEC })
    await $.command.register({ name: 'play-pause', description: 'Play or pause the song', ...SPEC })
    await $.command.register({ name: 'playback', description: 'Show the playback buttons in a pane', ...SPEC })

    const check = async (): Promise<void> => {
      const now = await nowPlaying(argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS }))

      if (now !== track) {
        track = now
        $.ui.invalidate('ui.render')
      }
    }

    await check()
    $.clock.every(EVERY, check)

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
    dismissed = false
    await $.ui.open({ id: PANE, title: 'Now playing' })

    return { text: 'Playback buttons opened.' }
  })

  // The band row above the prompt: the same buttons, shown only while a song is playing.
  on('ui.render', { component: 'AbovePrompt' }, ($, e, next) => {
    if (track === undefined || dismissed) {
      return next(e)
    }

    const { Box, Button, Text } = $.ui.resolve(e)

    const press = (action: Action) => async () => {
      $.ui.toast(await describe(action, argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })))
    }

    return (
      <Box>
        <Text dimColor>🎵 {track} </Text>
        <Button key="previous" label="⏮ Previous" onPress={press('previous')} />
        <Button key="playpause" label="⏯ Play / pause" onPress={press('playpause')} />
        <Button key="next" label="⏭ Next" onPress={press('next')} />
        <Button
          key="close"
          label="✕"
          onPress={() => {
            dismissed = true
            $.ui.invalidate('ui.render')
          }}
        />
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, ($, e) => {
    const { Box, Button, Text } = $.ui.resolve(e)

    if (track === undefined) {
      return <Text dimColor>Nothing is playing right now.</Text>
    }

    // Each button runs its action and shows the result as a toast.
    const press = (action: Action) => async () => {
      $.ui.toast(await describe(action, argv => $.process.run(argv, { timeoutMs: TIMEOUT_MS })))
    }

    return (
      <Box flexDirection="column">
        <Text dimColor>Playing: {track}</Text>
        <Box flexDirection="row">
          <Button key="previous" onPress={press('previous')}>⏮ Previous</Button>
          <Button key="playpause" onPress={press('playpause')}>⏯ Play / pause</Button>
          <Button key="next" onPress={press('next')}>⏭ Next</Button>
        </Box>
      </Box>
    )
  })
}
