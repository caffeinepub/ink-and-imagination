import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  type MangaItem = {
    id : Nat;
    title : Text;
    author : Text;
    genre : Text;
    price : Float;
    coverImage : Storage.ExternalBlob;
    synopsis : Text;
    volumeCount : Nat;
    stock : Nat;
    isNew : Bool;
    isFeatured : Bool;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module MangaItem {
    public func compare(manga1 : MangaItem, manga2 : MangaItem) : Order.Order {
      Nat.compare(manga1.id, manga2.id);
    };
  };

  // State
  let mangaStore = Map.empty<Nat, MangaItem>();
  var nextItemId = 1;
  let accessControlState = AccessControl.initState();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // User Profile Functions

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Query Functions
  public query ({ caller }) func getAllManga() : async [MangaItem] {
    mangaStore.values().toArray().sort();
  };

  public query ({ caller }) func getMangaById(id : Nat) : async MangaItem {
    switch (mangaStore.get(id)) {
      case (null) { Runtime.trap("Manga item not found") };
      case (?item) { item };
    };
  };

  public query ({ caller }) func getFeaturedManga() : async [MangaItem] {
    mangaStore.values().toArray().sort().filter(
      func(m) { m.isFeatured }
    );
  };

  public query ({ caller }) func getNewArrivals() : async [MangaItem] {
    mangaStore.values().toArray().sort().filter(
      func(m) { m.isNew }
    );
  };

  public query ({ caller }) func getByGenre(genre : Text) : async [MangaItem] {
    mangaStore.values().toArray().sort().filter(
      func(m) { Text.compare(m.genre, genre) == #equal }
    );
  };

  public query ({ caller }) func getByPriceRange(minPrice : Float, maxPrice : Float) : async [MangaItem] {
    mangaStore.values().toArray().sort().filter(
      func(m) { m.price >= minPrice and m.price <= maxPrice }
    );
  };

  public query ({ caller }) func searchByTitle(title : Text) : async [MangaItem] {
    mangaStore.values().toArray().sort().filter(
      func(m) { m.title.toLower().contains(#text(title.toLower())) }
    );
  };

  // Admin Functions (no auth check — protected by frontend password gate)
  public shared ({ caller }) func addManga(newManga : MangaItem) : async MangaItem {
    let mangaItem : MangaItem = {
      newManga with
      id = nextItemId;
      createdAt = Time.now();
    };
    mangaStore.add(nextItemId, mangaItem);
    nextItemId += 1;
    mangaItem;
  };

  public shared ({ caller }) func updateManga(manga : MangaItem) : async () {
    switch (mangaStore.get(manga.id)) {
      case (null) { Runtime.trap("Manga item not found") };
      case (?_existingItem) {
        mangaStore.add(manga.id, manga);
      };
    };
  };

  public shared ({ caller }) func removeManga(id : Nat) : async () {
    if (not mangaStore.containsKey(id)) {
      Runtime.trap("Manga with given id not found");
    };
    mangaStore.remove(id);
  };

  // Seeding Sample Data (called on first deploy)
  public shared ({ caller }) func seedSampleData() : async () {
    if (mangaStore.size() > 0) {
      Runtime.trap("Sample data already seeded");
    };

    for (item in sampleData().values()) {
      let mangaItem : MangaItem = {
        item with
        id = nextItemId;
        createdAt = Time.now();
      };
      mangaStore.add(nextItemId, mangaItem);
      nextItemId += 1;
    };
  };

  func sampleData() : [MangaItem] {
    [
      {
        id = 0;
        title = "Attack on Titan";
        author = "Hajime Isayama";
        genre = "Action";
        price = 19.99;
        coverImage = "";
        synopsis = "Humans fight for survival against giant humanoid creatures called Titans. Action-packed post-apocalyptic world.";
        volumeCount = 34;
        stock = 50;
        isNew = true;
        isFeatured = true;
        createdAt = 0;
      },
      {
        id = 0;
        title = "One Piece";
        author = "Eiichiro Oda";
        genre = "Action/Adventure";
        price = 17.99;
        coverImage = "";
        synopsis = "Follows Monkey D. Luffy and his crew searching for the ultimate treasure in the Grand Line. Epic pirate adventure.";
        volumeCount = 100;
        stock = 30;
        isNew = false;
        isFeatured = true;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Fullmetal Alchemist";
        author = "Hiromu Arakawa";
        genre = "Fantasy/Action";
        price = 14.99;
        coverImage = "";
        synopsis = "Brothers Edward and Alphonse Elric use alchemy to search for the Philosopher's Stone. Tragic and magical quest.";
        volumeCount = 27;
        stock = 45;
        isNew = true;
        isFeatured = true;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Death Note";
        author = "Tsugumi Ohba";
        genre = "Thriller/Mystery";
        price = 12.99;
        coverImage = "";
        synopsis = "High school student Light Yagami finds a mysterious notebook that allows him to kill anyone. Intense psychological thriller.";
        volumeCount = 12;
        stock = 30;
        isNew = false;
        isFeatured = true;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Demon Slayer";
        author = "Koyoharu Gotouge";
        genre = "Action/Shounen";
        price = 21.99;
        coverImage = "";
        synopsis = "Tanjiro Kamado battles demons after his family is slaughtered and his sister turned into one. Emotional and thrilling.";
        volumeCount = 23;
        stock = 40;
        isNew = true;
        isFeatured = false;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Berserk";
        author = "Kentaro Miura";
        genre = "Dark Fantasy/Seinen";
        price = 24.99;
        coverImage = "";
        synopsis = "Dark fantasy series following the struggles of Guts, a lone mercenary. Notorious for intense and mature themes.";
        volumeCount = 40;
        stock = 25;
        isNew = false;
        isFeatured = true;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Fruits Basket";
        author = "Natsuki Takaya";
        genre = "Romance/Slice of Life";
        price = 13.99;
        coverImage = "";
        synopsis = "High school girl Tohru Honda becomes involved with a family under a curse. Heartwarming and emotional.";
        volumeCount = 23;
        stock = 35;
        isNew = true;
        isFeatured = false;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Vinland Saga";
        author = "Makoto Yukimura";
        genre = "Historical/Action";
        price = 22.99;
        coverImage = "";
        synopsis = "Viking epic following the adventures of Thorfinn. Drawing from historical events with compelling characters.";
        volumeCount = 25;
        stock = 20;
        isNew = false;
        isFeatured = true;
        createdAt = 0;
      },
      {
        id = 0;
        title = "My Hero Academia";
        author = "Kohei Horikoshi";
        genre = "Action/Shounen";
        price = 19.99;
        coverImage = "";
        synopsis = "World where people have superpowers called Quirks. Izuku Midoriya trains to become a hero.";
        volumeCount = 32;
        stock = 60;
        isNew = true;
        isFeatured = false;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Sailor Moon";
        author = "Naoko Takeuchi";
        genre = "Romance/Fantasy";
        price = 11.99;
        coverImage = "";
        synopsis = "Magical girl Usagi Tsukino fights evil with her friends as Sailor Guardians. Iconic shoujo series.";
        volumeCount = 18;
        stock = 50;
        isNew = false;
        isFeatured = true;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Chainsaw Man";
        author = "Tatsuki Fujimoto";
        genre = "Action/Horror";
        price = 18.99;
        coverImage = "";
        synopsis = "Denji merges with a devil to become Chainsaw Man, fighting supernatural threats. Violent, twisted and unique.";
        volumeCount = 12;
        stock = 40;
        isNew = true;
        isFeatured = false;
        createdAt = 0;
      },
      {
        id = 0;
        title = "Spy x Family";
        author = "Tatsuya Endo";
        genre = "Comedy/Action";
        price = 16.99;
        coverImage = "";
        synopsis = "Spy, assassin and telepath form a fake family for an undercover mission. Action espionage with comedic elements.";
        volumeCount = 8;
        stock = 55;
        isNew = false;
        isFeatured = true;
        createdAt = 0;
      },
    ];
  };
};
