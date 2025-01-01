# 语音 Core

Virtuals 智能体被设计为拥有与自身个性和角色相符的独特语音。因此，训练语音模型是一个至关重要的过程，它确保每个角色的语音不仅逼真，而且与他们设定的人物形象保持一致。

语音 Core 中使用了两个模块：
- **语音转文本模块**：语音转文本（STT）模块通过大量的语音数据进行训练。这样的训练使该模块能够准确转录各种口音、方言和说话模式，在不同的用户场景中都能展现出多功能性和可靠性。
- **文本转语音模块**：对于文本转语音（TTS）模块，我们采用变分推断文本转语音（VITS）训练方法。VITS 以能够生成高质量、自然的语音而闻名。对于我们的平台来说，这种训练尤为重要，因为每个人工智能角色都需要一种特定的语音，以匹配其独特的个性和特点。VITS 模型能够在语音合成中实现这种定制化和高质量的要求。

在模型训练之前，需要进行数据处理。

### 数据预处理所使用的技术

- **格式一致性**：将所有音频文件统一为相同的格式（WAV）和规格（22050 赫兹，单声道）可确保一致性，这对于机器学习模型的最佳性能至关重要。不一致的音频格式会导致输入数据的可变性，可能使模型产生混淆并降低性能。
- **采样率归一化（22050 赫兹）**：采样率决定了音频文件每秒的采样数量。像 22050 赫兹这样的标准采样率经常被使用，因为它足以捕捉人类语音的频率范围，同时能使文件大小易于管理。它也符合奈奎斯特定理，能够捕捉高达 11025 赫兹的所有频率，这涵盖了大部分人类听觉范围。
- **单声道**：将立体声或多声道音频文件转换为单声道，可确保模型在单通道上进行训练，从而简化学习过程。

> 样例代码：
> ```python
> import os
> from pydub import AudioSegment
>
> upload_dir = 'upload_dir'
> output_dir = 'out'
>
> # Ensure the output directory exists
> os.makedirs(output_dir, exist_ok=True)
>
> extensions = ['wav', 'mp3', 'ogg']
>
> # Process all files in the upload directory
> for filename in os.listdir(upload_dir):
>   if any(filename.lower().endswith(ext) for ext in extensions):
>     # Construct file paths
>     file_path = os.path.join(upload_dir, filename)
>     output_path = os.path.join(output_dir, os.path.splitext(filename)[0] + '.wav')
>
>     # Load the audio file
>     audio = AudioSegment.from_file(file_path)
>
>     # Convert to WAV, 22050 Hz, mono
>     audio = audio.set_frame_rate(22050).set_channels(1)
>
>     # Export the processed audio
>     audio.export(output_path, format='wav')
> ```

了解更多关于[为语音 Core 做贡献](../../../../developer-documents/agent-contribution/contribute-to-voice-core)的信息。
