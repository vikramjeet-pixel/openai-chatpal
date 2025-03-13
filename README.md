
# AI Studio - Image Generator & Chat Bot

A modern web application that leverages OpenAI's powerful APIs to generate images using DALL-E 3 and have conversations using GPT-4.

![AI Studio Preview](public/og-image.png)

## Features

### Image Generation
- Create stunning AI-generated images using DALL-E 3
- Multiple aspect ratio options (Square, Portrait, Landscape)
- Live image preview
- One-click download of generated images
- Regenerate images with the same prompt

### Chat Bot
- Intelligent conversations powered by GPT-4
- Full chat history with user and assistant messages
- Support for markdown in responses
- Clear conversation feature

### Shared Features
- Secure API key management (stored in localStorage)
- Modern, responsive UI built with React and Tailwind CSS
- Beautiful gradient design elements
- Seamless tab switching between image and chat modes

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: OpenAI API (DALL-E 3, GPT-4)
- **State Management**: React useState
- **UI Components**: Custom components and shadcn/ui

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))

### Installation

1. Clone the repository
```sh
git clone https://github.com/yourusername/ai-studio.git
cd ai-studio
```

2. Install dependencies
```sh
npm install
# or
yarn
```

3. Start the development server
```sh
npm run dev
# or
yarn dev
```

4. Open your browser and visit `http://localhost:8080`

### Usage

1. Enter your OpenAI API key in the provided field
2. For image generation:
   - Select the "Image Creator" tab
   - Enter a detailed description of the image you want to create
   - Select your preferred aspect ratio
   - Click "Create Image"
   - Download or regenerate as needed

3. For chat:
   - Select the "Chat Bot" tab
   - Type your message and press Enter
   - View the AI's response and continue the conversation

## Security Note

This application stores your OpenAI API key in your browser's localStorage. While convenient, be cautious when using on shared devices. For production applications, consider implementing a backend service to securely handle API requests.

## License

[MIT](LICENSE)

## Acknowledgements

- [OpenAI](https://openai.com/) for providing the powerful AI APIs
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Vite](https://vitejs.dev/) for the fast development environment
- [React](https://reactjs.org/) for the frontend framework

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
