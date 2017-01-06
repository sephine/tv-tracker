class AutomaticUpdate
  def self.update_all
    Rails.logger.debug("AUTOMATIC UPDATE SERIES NAMES:")
    #start = Time.now
    #epoch_start = start.to_i - 3600 #an hour ago
    epoch_start = 1475364230
    epoch_now = Time.now.to_i
    tvdb_refs_to_check = []
    (epoch_start..epoch_now).step(518400) do |epoch_step|
      response = TheTVDB.update(epoch_step)
      return if response.code == 401
      if response.include?('data') && response['data'] != nil
        response['data'].each do |record|
          tvdb_refs_to_check << record['id']
        end
      end
    end
    search = ProgrammeInfo.where(tvdb_ref: tvdb_refs_to_check)
    updated = []
    search.each do |programme_info|
      programme_info.update_from_tvdb
      updated << [programme_info.tvdb_ref, programme_info.seriesName]
    end
    Rails.logger.debug(updated)

    ThetvdbUpdate.destroy_all
    thetvdb_update = ThetvdbUpdate.new(update_start: epoch_now)
    thetvdb_update.save
  end
end
