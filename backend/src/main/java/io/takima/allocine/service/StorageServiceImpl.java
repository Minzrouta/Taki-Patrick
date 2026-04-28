package io.takima.allocine.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
public class StorageServiceImpl implements StorageService {

    private Path rootLocation;

    @Autowired
    public StorageServiceImpl() {
        File currentDirFile = new File("");
        String helper = currentDirFile.getAbsolutePath();
        this.rootLocation = Paths.get(helper + "/assets");
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void store(MultipartFile file, String name) {
        try {
            if (file.isEmpty()) {
                throw new RuntimeException("Trying to store an empty file");
            }
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, this.rootLocation.resolve(name),
                        StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + name, e);
        }

        System.out.println(this.rootLocation.resolve(name));
    }

    @Override
    public void delete(String name) {
        try {
            Files.delete(this.rootLocation.resolve(name));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public byte[] load(String filename) {
        try {
            Path tempFile = Files.createTempFile("tempFile", null);

            Files.copy(rootLocation.resolve(filename), tempFile, StandardCopyOption.REPLACE_EXISTING);

            byte[] data = Files.readAllBytes(tempFile);

            Files.delete(tempFile);

            return data;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
