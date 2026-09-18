# Song Storage Workflow

## Development

Store local audio files outside MySQL:

```text
backend/uploads/songs/
```

The backend serves files through:

```text
http://localhost:5000/uploads/songs/<file-name>
```

The `songs` table stores only metadata and the `audio_url` value, for example:

```text
/uploads/songs/1720000000000-believer.mp3
```

Supported local upload formats:

```text
.mp3, .wav, .ogg, .m4a, .aac, .flac, .webm
```

The Library page supports two development workflows:

1. Upload an audio file with song metadata. The file is saved in `backend/uploads/songs`, and metadata is saved in MySQL.
2. Place audio files manually in `backend/uploads/songs`, then use `Load Local Folder` to create missing MySQL song records.

Uploaded media is ignored by Git. Only `.gitkeep` placeholders should be committed.

## Sandbox Or Production

Use object storage instead of the backend filesystem:

```text
Angular UI
  -> Node.js API reads/writes MySQL metadata
  -> Browser streams audio directly from object storage/CDN
```

Recommended storage:

- AWS S3 with CloudFront
- Azure Blob Storage
- Google Cloud Storage
- Cloudinary or another managed media platform

Production metadata flow:

1. Upload audio to object storage.
2. Store only metadata and the public, private, or signed URL in MySQL.
3. Return metadata through `GET /api/songs`.
4. Let the Angular audio player stream from the returned `audioUrl`.

Production requirements:

- Enable HTTP range requests for seeking.
- Validate audio MIME type and file extension.
- Enforce file-size limits.
- Use signed URLs for private songs.
- Put CDN caching in front of public media.
- Avoid streaming every song through Node.js unless authorization requires it.
