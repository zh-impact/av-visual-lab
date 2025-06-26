# from silero_vad import load_silero_vad, read_audio, get_speech_timestamps
# model = load_silero_vad()
# wav = read_audio("local/shuo.wav")
# speech_timestamps = get_speech_timestamps(
#     wav,
#     model,
#     return_seconds=True,  # Return speech timestamps in seconds (default is samples)
# )
# print(speech_timestamps)

import numpy as np
from scipy.io.wavfile import write

sample_rate = 44100  # Sample rate in Hz
duration = 15  # Duration of the white noise in seconds

noise = np.random.normal(0, 1, sample_rate * duration)
noise = noise / np.max(np.abs(noise))
noise = (noise * 2**15).astype(np.int16)
write('local/white_noise2.wav', sample_rate, noise)
