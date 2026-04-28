package io.takima.allocine.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    void store(MultipartFile file, String name);

    void delete(String name);

    byte[] load(String filename);
}
