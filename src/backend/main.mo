import Map "mo:core/Map";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";


actor {
  type Manga = {
    id : Text;
    title : Text;
    author : Text;
    genre : Text;
    price : Float;
    description : Text;
    coverImage : Text;
    stock : Nat;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  module Manga {
    public func compare(manga1 : Manga, manga2 : Manga) : Order.Order {
      Text.compare(manga1.title, manga2.title);
    };
  };

  let accessControlState = AccessControl.initState();
  let mangas = Map.empty<Text, Manga>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
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

  public shared ({ caller }) func addManga(manga : Manga) : async () {
    mangas.add(manga.id, manga);
  };

  public shared ({ caller }) func updateManga(manga : Manga) : async () {
    switch (mangas.get(manga.id)) {
      case (null) { Runtime.trap("Manga not found") };
      case (?_existing) { mangas.add(manga.id, manga) };
    };
  };

  public shared ({ caller }) func deleteManga(id : Text) : async () {
    if (not mangas.containsKey(id)) { Runtime.trap("Manga not found") };
    mangas.remove(id);
  };

  public shared ({ caller }) func clearAllManga() : async () {
    let keys = mangas.keys().toArray();
    for (key in keys.vals()) {
      mangas.remove(key);
    };
  };

  public query ({ caller }) func getMangaById(id : Text) : async Manga {
    switch (mangas.get(id)) {
      case (null) { Runtime.trap("Manga not found") };
      case (?manga) { manga };
    };
  };

  public query ({ caller }) func listAllManga() : async [Manga] {
    mangas.values().toArray().sort();
  };

  public shared ({ caller }) func seedManga() : async () {
  };
};
