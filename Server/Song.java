import java.io.*;

public class Song {
    private float key;
    private double mode_confidence; 
    private double artist_mbtags_count;
    private double key_confidence;
    private double tatums_start;
    private int year;
    private double duration;
    private double hotttnesss;
    private double beats_start;
    private double time_signature_confidence;
    private String title; 
    private double bars_confidence;
    private String id;
    private double bars_start;
    private String artist_mbtags; 
    private double start_of_fade_out;
    private double tempo; 
    private double end_of_fade_in;
    private double beats_confidence;
    private double tatums_confidence;
    private double mode;
    private double time_signature;
    private double loudness;

    public Song(float k, double m, double a, double key, double tat, int y, double d, double h,
    double b, double time, String ttl, double bars, String i, double bs, String am, double sf, double tem,
    double eof, double bc, double tatums, double mode, double ts, double loud) {
        key = k;
        mode_confidence = m;
        artist_mbtags_count = a;
        key_confidence = key;
        tatums_confidence = tat;
        year = y;
        duration = d;
        hotttnesss = h;
        beats_start = b;
        time_signature_confidence = time;
        title = ttl;
        bars_confidence = bars;
        id = i;
        bars_start = bs;
        artist_mbtags = am;
        start_of_fade_out = sf;
        tempo = tem;
        end_of_fade_in = eof;
        beats_confidence = bc;
        tatums_confidence = tatums;
        this.mode = mode;
        time_signature = ts;
        loudness = loud;
    }

    public Song() {}

    public double getHottness() {
        return hotttnesss;
    }

    public String getTitle() {
        return title;
    }

    public String getID() {
        return id;
    }
}