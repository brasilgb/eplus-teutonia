<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.png" type="image/png">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @isset($socialMeta)
            <meta property="og:type" content="product">
            <meta property="og:site_name" content="Eplus">
            <meta property="og:title" content="{{ $socialMeta['title'] }}">
            <meta property="og:description" content="{{ $socialMeta['description'] }}">
            <meta property="og:url" content="{{ $socialMeta['url'] }}">
            @if ($socialMeta['image'])
                <meta property="og:image" content="{{ $socialMeta['image'] }}">
                <meta property="og:image:secure_url" content="{{ $socialMeta['image'] }}">
                @if ($socialMeta['imageType'])
                    <meta property="og:image:type" content="{{ $socialMeta['imageType'] }}">
                @endif
                @if ($socialMeta['imageWidth'] && $socialMeta['imageHeight'])
                    <meta property="og:image:width" content="{{ $socialMeta['imageWidth'] }}">
                    <meta property="og:image:height" content="{{ $socialMeta['imageHeight'] }}">
                @endif
                <meta property="og:image:alt" content="{{ $socialMeta['title'] }}">
            @endif
        @endisset

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Laravel') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
