import localFont from 'next/font/local'

export const cascadiaMono = localFont({
  src: [
    {
      path: '../public/fonts/CascadiaMono.ttf',
      style: 'normal',
    },
    {
      path: '../public/fonts/CascadiaMonoItalic.ttf',
      style: 'italic',
    },
  ],
})
