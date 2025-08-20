const MultimediaModel = require('../models/multimedia.model');
const pool = require('../config/db');

// Mock the database pool
jest.mock('../config/db');

describe('Multimedia Model', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload content successfully', async () => {
      const mockResult = { insertId: 123 };
      pool.query.mockResolvedValue([mockResult]);

      const contentData = {
        course_id: 1,
        title: 'Introduction Video',
        type: 'video',
        url: 'https://example.com/video.mp4'
      };

      const result = await MultimediaModel.upload(contentData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO contents'),
        [1, 'Introduction Video', 'video', 'https://example.com/video.mp4']
      );
      expect(result).toBe(123);
    });

    it('should handle upload database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database error'));

      const contentData = {
        course_id: 1,
        title: 'Test Content',
        type: 'document',
        url: 'https://example.com/doc.pdf'
      };

      await expect(MultimediaModel.upload(contentData)).rejects.toThrow('Database error');
    });

    it('should upload different content types', async () => {
      const mockResult = { insertId: 456 };
      pool.query.mockResolvedValue([mockResult]);

      const contentTypes = [
        { type: 'video', url: 'https://example.com/video.mp4' },
        { type: 'document', url: 'https://example.com/doc.pdf' },
        { type: 'audio', url: 'https://example.com/audio.mp3' },
        { type: 'image', url: 'https://example.com/image.jpg' }
      ];

      for (const contentType of contentTypes) {
        const contentData = {
          course_id: 1,
          title: `Test ${contentType.type}`,
          type: contentType.type,
          url: contentType.url
        };

        const result = await MultimediaModel.upload(contentData);
        
        expect(pool.query).toHaveBeenCalledWith(
          expect.stringContaining('INSERT INTO contents'),
          [1, `Test ${contentType.type}`, contentType.type, contentType.url]
        );
        expect(result).toBe(456);
      }
    });
  });

  describe('findByCourse', () => {
    it('should find content by course successfully', async () => {
      const mockContent = [
        { id: 1, course_id: 1, title: 'Video 1', type: 'video', url: 'video1.mp4' },
        { id: 2, course_id: 1, title: 'Document 1', type: 'document', url: 'doc1.pdf' }
      ];

      pool.query.mockResolvedValue([mockContent]);

      const result = await MultimediaModel.findByCourse(1);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM contents WHERE course_id = ?'),
        [1]
      );
      expect(result).toEqual(mockContent);
    });

    it('should return empty array when no content found', async () => {
      pool.query.mockResolvedValue([[]]);

      const result = await MultimediaModel.findByCourse(999);

      expect(result).toEqual([]);
    });

    it('should handle find by course database errors', async () => {
      pool.query.mockRejectedValue(new Error('Database connection failed'));

      await expect(MultimediaModel.findByCourse(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('update', () => {
    it('should update content successfully', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const updateData = {
        title: 'Updated Title',
        type: 'video',
        url: 'https://example.com/updated-video.mp4'
      };

      await MultimediaModel.update(1, updateData);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE contents SET'),
        ['Updated Title', 'video', 'https://example.com/updated-video.mp4', 1]
      );
    });

    it('should handle update database errors', async () => {
      pool.query.mockRejectedValue(new Error('Update failed'));

      const updateData = {
        title: 'Updated Title',
        type: 'video',
        url: 'https://example.com/video.mp4'
      };

      await expect(MultimediaModel.update(1, updateData)).rejects.toThrow('Update failed');
    });

    it('should update with different data combinations', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const updateCombinations = [
        { title: 'New Title', type: 'video', url: 'new-video.mp4' },
        { title: 'Document Title', type: 'document', url: 'document.pdf' },
        { title: 'Audio File', type: 'audio', url: 'audio.mp3' }
      ];

      for (const updateData of updateCombinations) {
        await MultimediaModel.update(1, updateData);
        
        expect(pool.query).toHaveBeenCalledWith(
          expect.stringContaining('UPDATE contents SET'),
          [updateData.title, updateData.type, updateData.url, 1]
        );
      }
    });
  });

  describe('delete', () => {
    it('should delete content successfully', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      await MultimediaModel.delete(1);

      expect(pool.query).toHaveBeenCalledWith(
        'DELETE FROM contents WHERE id = ?',
        [1]
      );
    });

    it('should handle delete database errors', async () => {
      pool.query.mockRejectedValue(new Error('Delete failed'));

      await expect(MultimediaModel.delete(1)).rejects.toThrow('Delete failed');
    });

    it('should delete content with different IDs', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 1 }]);

      const contentIds = [1, 5, 10, 100];

      for (const id of contentIds) {
        await MultimediaModel.delete(id);
        
        expect(pool.query).toHaveBeenCalledWith(
          'DELETE FROM contents WHERE id = ?',
          [id]
        );
      }
    });

    it('should handle non-existent content deletion', async () => {
      pool.query.mockResolvedValue([{ affectedRows: 0 }]);

      // Should not throw error even if content doesn't exist
      await expect(MultimediaModel.delete(999)).resolves.toBeUndefined();
    });
  });
});
